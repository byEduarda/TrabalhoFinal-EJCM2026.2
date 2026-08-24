import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { CartController } from './CartController';





export class CartItemController{

    static async create(req: Request, res: Response){
        try{
            const{quantity,cartId,variantId}=req.body;
            const newprice = await prisma.productVariant.findUnique({
                where:{id:variantId},
                select:{
                    product:{
                        select:{
                            price:true,
                        },
                    },
                },
            });
            
            const newCartItem = await prisma.cartItem.create({
                
                data:{
                    quantity,
                    unitPrice: newprice?.product.price||10000000000000000000000000,
                
                    cartId,
                    variantId
                }
            });

            
            const total = await CartController.recalculateTotal(cartId);
            await prisma.cart.update({
                where:{id: cartId},
                data:{
                    totalPrice: total,
                }

            });
            return res.status(201).json(newCartItem);
        }catch(error){
             console.error(error);
            return res.status(500).json({ 
                error: 'Erro ao criar item do carrinho' 
            });
        }
        
    }
     static async get(req: Request, res: Response){
        try{
            const {id} = req.params;

            const getItem = await prisma.cartItem.findUnique({
                where:{id}
            });
            return res.json(getItem);

        }catch(error){
            console.error(error);
            return res.status(500).json({ 
            error: 'Erro ao buscar item no carrinho' 
            });
        } 
    }
    static async update(req: Request, res: Response){
        try{
            const {id} = req.params;
            const {quantity} = req.body;
            const varianate = await prisma.cartItem.findUnique({
                where:{id},
                select:{
                    variantId: true,
                }
            });
            const newprice = await prisma.productVariant.findUnique({
                where:{id: varianate?.variantId},
                select:{
                    product:{
                        select:{
                            price:true,
                        },
                    },
                },
            });
           
            const updateItem = await prisma.cartItem.update({
                where:{cartId_variantId:{
                    cartId:cartId,
                    variantId: variantId
                }},
                data:{
                    quantity,
                    unitPrice: newprice?.product.price,
                }
            });
            return res.json(updateItem);
        }catch(error){
            console.error(error);
            return res.status(500).json({ 
            error: 'Erro ao atualizar item no carrinho' 
            });
        }
    }
    static async delete(req: Request, res: Response) {
        try {
            const { userId, variantId } = req.params;

            if (!userId) {
                return res.status(403).json({
                    error: "Usuário não tem permissão para deletar item do carrinho"
                });
            }
            const variante = await prisma.productVariant.findUnique({
                where:{
                    id: variantId,
                }
            })
            const cart = await prisma.cart.findUnique({
                where: {
                    id:userId
                }
            });

            if (!cart) {
                return res.status(404).json({
                    error: "Carrinho não encontrado"
                });
            }


            const deletedItem = await prisma.cartItem.delete({
                where: {
                    cartId_variantId: {
                        cartId: cart.id,
                        variantId: variante?.id
                    }
                }
            });

            return res.status(200).json(deletedItem);

        } catch (error: any) {
            console.error(error);

            return res.status(500).json({
                error: error.message
            });
        }
    }
}
        
    
