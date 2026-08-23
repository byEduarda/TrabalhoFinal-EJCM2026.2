import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

//DEIXEI O ERRO ESPECÍFICO PARA FAZERMOS OS TESTES, MAS NO FINAL PRECISAMOS TROCAR PARA GENÉRICOS!

export class WishListController {

    static async create(req:Request, res:Response){
        try{
            const{userId} = req.params; //colocar aqui o token_user
            const{productId} = req.body;
            
            if(userId){
                const newWishList = await prisma.wishlist.create({
                    data: {
                        productId: productId,
                        userId: userId
                    }
                });
                return res.status(201).json(newWishList)
            }
            return res.status(403).json({error: "Usuário não tem permissão para adicionar produto nesta wishlist"})
        }
        catch (error:any){
            if (error.code === 'P2002'){
                return res.status(409).json({error: "Este produto já está na wishlist"});
            }
            console.error(error);
            return res.status(500).json({ error:error.message });
        }
    }

    static async get(req:Request, res:Response){
        try{
            const{userId} = req.params; //colocar aqui o token_user

            if(userId){
                const readWishList = await prisma.wishlist.findMany({
                    where: {userId},
                    include: {
                        product: {
                            select: {name:true, price: true, rating: true}
                        }
                    }
                }); 
                return res.status(200).json(readWishList);
            }
            return res.status(403).json({error: "Usuário não tem permissão para ler Wishlist"});
        }
        catch (error:any){
            console.error(error);
            return res.status(500).json({ error:error.message });
        }
    }

    static async deleteOne(req:Request, res:Response){
        try{
            const{userId} = req.params;  //colocar aqui o token_user
            const {productId} = req.params;
            
            if(userId){
                const deletedProduct = await prisma.wishlist.delete({
                    where: {
                        userId_productId: {
                            userId: userId,
                            productId: productId
                        }
                    }
                });
                return res.status(200).json(deletedProduct)
            }
            return res.status(403).json({error:"Usuário não tem permissão para deletar produto da Wishlist"});
        }
        catch (error:any){
            console.error(error);
            return res.status(500).json({ error:error.message });
        }
    }

    static async deleteAll(req:Request, res:Response){
        try{
            const{userId} = req.params;  //colocar aqui o token_user

            if(userId){
                const deletedWishList = await prisma.wishlist.deleteMany({
                    where: {userId}
                });
                return res.status(200).json(deletedWishList);
            }
            return res.status(403).json({error: "Usuário não tem permissão para deletar essa wishlist"});
        }
        catch (error:any){
            console.error(error);
            return res.status(500).json({ error:error.message });
        }
    }
}