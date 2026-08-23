import { Request, Response } from 'express';
import { prisma } from '../config/prisma';


export class CartItem{

    static async create(req: Request, res: Response){
        try{

        }catch{
             console.error(erro);
            return res.status(500).json({ 
                error: 'Erro ao criar carrinho' 
            });
        }
    }
}