import { Request, Response } from 'express';
import { prisma } from '../config/prisma';


export class CartController {
    static async create(req: Request, res: Response) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ 
                    error: 'userId é obrigatório' 
                });
            }

            // Se já existir um carrinho para o usuário, retorna ele
            const existing = await prisma.cart.findUnique({ 
                where: { userId } 
            });

            if (existing) {
                return res.status(200).json(existing);
            }


            const newCart = await prisma.cart.create({
                data: {
                    userId,
                    totalPrice: 0,
                    savings: 0,
                },
            });

            return res.status(201).json(newCart);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ 
                error: 'Erro ao criar carrinho' 
            });
        }
    }

    static async getByUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId || req.query.userId;

            if (!userId) {
                return res.status(400).json({
                    error: 'userId é obrigatório' 
                });
            }

            const cart = await prisma.cart.findUnique({
                where: { 
                    userId: String(userId) 
                },
                include: {
                    items: { 
                        include: { 
                            variant: { 
                                include: { 
                                    product:true 
                                } 
                            } 
                        } 
                    },
                    coupon: true
                },
            });

            if (!cart) {
                return res.status(404).json({
                    error: 'Carrinho não encontrado' 
                });
            }

            return res.json(cart);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ 
                error: 'Erro ao buscar carrinho' 
            });
        }
    }

    static async addItem(req: Request, res: Response) {
        try {
            const { userId, variantId, quantity } = req.body;

            if (!userId || !variantId || !quantity) {
                return res.status(400).json({ 
                error: 'Campos obrigatórios: userId, variantId, quantity' 
            });
            }

            // garante que exista carrinho
            let cart = await prisma.cart.findUnique({  
                where: {
                    userId 
                } 
            });
            if (!cart) {
                cart = await prisma.cart.create({ 
                    data: { 
                        userId,
                        totalPrice: 0,
                         savings: 0 
                        } 
                    });
            }

            // pega o preço unitário a partir do produto associado à variant
            const variant = await prisma.productVariant.findUnique({ 
                where: { 
                    id: variantId 
                }, 
                include: { 
                    product: true 
                } 
            });

            if (!variant) return res.status(404).json({ error: 'Variant não encontrada' });

            const unitPrice = (variant as any).product?.price ?? variant.stockQuantity ?? 0;

            // verifica se já existe item para a mesma variante
            const existingItem = await prisma.cartItem.findUnique({ 
                where: { 
                    cartId_variantId: { 
                        cartId: 
                        cart.id, 
                        variantId 
                    } 
                } 
            });

            if (existingItem) {
                await prisma.cartItem.update({ 
                    where: { 
                        id: existingItem.id 
                    }, 
                    data: { 
                        quantity: existingItem.quantity + Number(quantity) } });
            } else {
                await prisma.cartItem.create({ 
                    data: { 
                        cartId: cart.id,
                        variantId,
                        quantity: Number(quantity), 
                        unitPrice: Number(unitPrice) 
                    } 
                });
            }

            // recalcula total
            await CartController.recalculateTotal(cart.id);

            const updated = await prisma.cart.findUnique({
                where: { 
                    id: cart.id 
                }, 
                include: { 
                    items: true 
                } 
            });
            return res.status(200).json(updated);
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ error: 'Erro ao adicionar item' });
        }
    }

    static async updateItem(req: Request, res: Response) {
        try {
            const { cartItemId, quantity } = req.body;

            if (!cartItemId || quantity == null){
                return res.status(400).json({ 
                    error: 'Campos obrigatórios: cartItemId, quantity' 
                });
            
            }

            const item = await prisma.cartItem.findUnique({ 
                where: { 
                    id: cartItemId 
                } 
            });

            if (!item) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            if (Number(quantity) <= 0) {
                await prisma.cartItem.delete({ 
                    where: { 
                        id: cartItemId 
                    } 
                });
            } else {
                await prisma.cartItem.update({ 
                    where: { 
                        id: cartItemId 
                    }, 
                    data: { 
                        quantity: Number(quantity) 
                    } 
                });
            }

            await CartController.recalculateTotal(item.cartId);

            const cart = await prisma.cart.findUnique({ 
                where: { 
                    id: item.cartId 
                }, 
                include: { 
                    items: true 
                } 
            });

            return res.json(cart);

        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ error: 'Erro ao atualizar item' });
        }
    }

    static async removeItem(req: Request, res: Response) {
        try {
            const { cartItemId } = req.params;

            if (!cartItemId) return res.status(400).json({ 
                error: 'cartItemId é obrigatório' 
            });

            const item = await prisma.cartItem.findUnique({ 
                where: { 
                    id: String(cartItemId) 
                } 
            });
            if (!item) {
                return res.status(404).json({
                     error: 'Item não encontrado' 
                    });
            }

            await prisma.cartItem.delete({ 
                where: { 
                    id: item.id 
                } 
            });

            await CartController.recalculateTotal(item.cartId);

            return res.status(200).json({ message: 'Item removido' });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ error: 'Erro ao remover item' });
        }
    }

    static async clear(req: Request, res: Response) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ 
                    error: 'userId é obrigatório' 
                });
            }

            const cart = await prisma.cart.findUnique({ 
                where: { 
                    userId 
                } 
            });

            if (!cart) {return res.status(404).json({ 
                error: 'Carrinho não encontrado' 
                });
            }

            await prisma.cartItem.deleteMany({ 
                where: { 
                    cartId: cart.id 
                } 
            });

            await prisma.cart.update({ 
                where: { 
                    id: cart.id 
                }, 
                data: { 
                    totalPrice: 0,
                     savings: 0 
                    } 
                });

            return res.json({ message: 'Carrinho limpo' });
        } catch (erro) {
            console.error(erro);
            return res.status(500).json({ 
                error: 'Erro ao limpar carrinho' 
            });
        }
    }

    private static async recalculateTotal(cartId: string) {
        const items = await prisma.cartItem.findMany({ 
            where: {
                 cartId 
            } 
        });

        const total = items.reduce((acc, it) => acc + Number(it.unitPrice) * Number(it.quantity), 0);

        await prisma.cart.update({ 
            where: { 
                id: cartId 
            }, 
            data: { 
                totalPrice: total 
            } 
        });
    }
}