import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class OrderController {
    static async create(req: Request, res: Response) {
        try {
            const { 
                status, 
                totalPrice, 
                address, 
                userId, 
                orderItems, 
                payments, 
                shipping 
            } = req.body;

            if (status === undefined || !totalPrice || !address || !userId) {
                return res.status(400).json({ 
                    error: "Os campos status, totalPrice, address e userId são obrigatórios." 
                });
            }

            //precisa de itens para existir um pedido
            if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
                return res.status(400).json({ 
                    error: "O pedido precisa ter pelo menos um item (orderItems)." 
                });
            }

            if (!shipping) {
                return res.status(400).json({ 
                    error: "As informações de envio (shipping) são obrigatórias." 
                });
            }

            const newOrder = await prisma.order.create({
                data: {
                    status: Boolean(status),
                    totalPrice: Number(totalPrice),
                    address,
                    userId,

                    orderItems: {
                        create: orderItems.map((item: any) => ({
                            quantity: Number(item.quantity),
                            unitPrice: Number(item.unitPrice),
                            variantId: item.variantId
                        }))
                    },

                    shipping: {
                        create: {
                            shippingMethod: shipping.shippingMethod,
                            shippingCost: Number(shipping.shippingCost),
                            trackingNumber: shipping.trackingNumber,
                            recipientFirstName: shipping.recipientFirstName,
                            recipientLastName: shipping.recipientLastName,
                            zipCode: shipping.zipCode,
                            streetAddress: shipping.streetAddress,
                            apartmentSuite: shipping.apartmentSuite || null,
                            city: shipping.city,
                            state: shipping.state
                        }
                    },

                    ...(payments && Array.isArray(payments) && payments.length > 0 && {
                        payments: {
                            create: payments.map((payment: any) => ({
                                method: payment.method,
                                lastFourDigits: payment.lastFourDigits,
                                ownerName: payment.ownerName,
                                status: Boolean(payment.status),
                                amount: Number(payment.amount)
                            }))
                        }
                    })
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true
                        }
                    },
                    orderItems: {
                        include: {
                            variant: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    },
                    shipping: true,
                    payments: true
                }
            });

            return res.status(201).json(newOrder);

        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            return res.status(500).json({ error: "Erro interno ao criar pedido." });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    orderItems: {
                        include: {
                            variant: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    },
                    shipping: true,
                    payments: true
                }
            });

            if (!order) {
                return res.status(404).json({ error: "Pedido não encontrado." });
            }

            return res.json(order);
        } catch (error) {
            console.error("Erro ao buscar pedido:", error);
            return res.status(500).json({ error: "Erro ao buscar pedido." });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status, totalPrice, address, shipping } = req.body;

            const updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                    ...(status !== undefined && { status: Boolean(status) }),
                    ...(totalPrice !== undefined && { totalPrice: Number(totalPrice) }),
                    ...(address && { address }),

                    // Atualização opcional de dados do Shipping
                    ...(shipping && {
                        shipping: {
                            update: {
                                ...(shipping.trackingNumber && { trackingNumber: shipping.trackingNumber }),
                                ...(shipping.shippingMethod && { shippingMethod: shipping.shippingMethod })
                            }
                        }
                    })
                },
                include: {
                    orderItems: true,
                    shipping: true,
                    payments: true
                }
            });

            return res.json(updatedOrder);
        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            return res.status(500).json({ error: "Erro ao atualizar pedido." });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await prisma.order.delete({
                where: { id }
            });

            return res.status(204).send();
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            return res.status(500).json({ error: "Erro ao deletar pedido." });
        }
    }
}