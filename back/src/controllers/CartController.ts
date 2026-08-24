import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { CartItemController } from './CartItemController';
import { Cart } from '../generated/prisma/client';

export class CartController {
    static async create(req: Request, res: Response) {
        try{
            const {userId}= req.body;

            const newCart = await prisma.cart.create({
                data:{
                    userId ,
                    totalPrice: 0,
                    savings: 0
                },
            });
            return res.status(201).json(newCart);
        }catch(error){
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar carrinho" });
        }
            
    }

    static async getbyId(req: Request, res: Response) {
       try{
            const {id} = req.params;
            const cart = await prisma.cart.findUnique({
                where:{id},
                include:{
                    items: true
                }
            });
            return res.json(cart);
       }catch(error){
        console.error(error);
            return res.status(500).json({ error: "Erro ao buscar carrinho" });
       }
    }

    

    static async updatecart(req: Request, res: Response) {
        try {
            const {id} = req.params;
            
            const {items,couponId} = req.body;
            //const total = await this.recalculateTotal(String(id));
            const valorCoupon = await prisma.coupon.findUnique({
                where:{id:couponId},
                select:{
                    value:true
                }
            });

            
            const updatedCart = await prisma.cart.update({
                where: {id},
                data:{
                    
                    savings: valorCoupon?.value,
                    items: prisma.cartItem[items],
                   
                },
                
                include:{
                    items:true
                }
            });
            
            const total= await CartController.recalculateTotal(id); 

            

            return res.json(total)

        }catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar carrinho" });
        }
    }

    static async removeItem(req: Request, res: Response) {
        try {
            const { cartId, itemId } = req.params;

            const item = await prisma.cartItem.findFirst({
                where: {
                    id: itemId,
                    cartId: cartId
                }
            });

            if (!item) {
                return res.status(404).json({
                    error: 'Item não encontrado no carrinho'
                });
            }

            await prisma.cartItem.delete({
                where: {
                    id: itemId
                }
            });
            const cart = await prisma.cart.findUnique({
                where:{id:cartId},
                include:{
                    items:true
                }
            })

            return res.status(200).json({
                cart
            });

        } catch (error: any) {
            console.error(error);

            return res.status(500).json({
                error: error.message
            });
        }
    }

    static async recalculateTotal(cartId: string){
    
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
        items: true,
        coupon: true,
        },
    });

    if (!cart) {
        throw new Error('Carrinho não encontrado.');
    }
    
  
    const subtotal = cart.items.reduce((acc, item) => {
        return acc + item.quantity * item.unitPrice;
    }, 0);

    
    let savings = 0;
    if (cart.coupon) {
        savings = cart.coupon.value;
    }

   
    const totalPrice = Math.max(0, subtotal - savings);

    
    const updatedCart = await prisma.cart.update({
        where: { id: cartId },
        data: {
        totalPrice,
        savings,
        },
        include: {
            items: true,
        },
        
        
    });

    return updatedCart ;
    }
}