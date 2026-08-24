import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export class CouponController{
    static async create(req:Request, res: Response){
        try{
            const {value,code,expirationDate,userId} = req.body;

            const newCoupon = await prisma.coupon.create({
               data:{
                    value,
                    code,
                    expirationDate,
                    userId
               }
            });

            return res.status(201).json(newCoupon);
        }catch(error){
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao criar cupom'
            })
        }
    }
}