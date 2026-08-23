import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import auth from '../config/auth';

export class UserController {
    static async create(req: Request, res: Response) {
        try {
            const {firstName, lastName, email, password, phone, dateOfBirth, gender} = req.body;

            if(!password) {
                return res.status(400).json({ error: "A senha é obrigatória"});
            }

            const { hash, salt } = auth.generatePassword(password);
            const passwordStored = `${hash}:${salt}`;
            const newUser = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: passwordStored,
                    phone,
                    dateOfBirth: new Date(dateOfBirth),
                    gender
                }
            });

            const { password: _, ...userWithoutPassword } = newUser;
            return res.status(201).json(userWithoutPassword);
        }catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar usuário"});
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email e senha são obrigatórios"});
            }

            const user = await prisma.user.findUnique({ where: {email} });

            if(!user) {
                return res.status(401).json({ error: "Credenciais inválidas"});
            }
            const [hash, salt] = user.password.split(':');
            if (!hash || !salt) {
                return res.status(500).json({ error: "Erro ao validar credenciais"});
            }
            const isValid = auth.checkPassword(password, hash, salt);
            if(!isValid) {
                return res.status(401).json({error: "Credenciais inválidas"});
            }
            
            const token = auth.generateJWT(user.id as unknown as number);
            const { password: _, ...userWithoutPassword } = user;

            return res.status(200).json({ user: userWithoutPassword, token});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao autenticar usuário"});
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            const { password: _, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar usuário"});
        }
    }
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { firstName, lastName, email, phone, dateOfBirth, gender } = req.body;

            const updateUser = await prisma.user.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    gender,
                    ...dateOfBirth && { dateOfBirth: new Date(dateOfBirth)}
                }
            });
            const { password: _, ...userWithoutPassword } = updateUser;
            return res.json(userWithoutPassword);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao atualizar o usuário"});
        }
    }
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.user.delete({
                where: { id }
            });
            return res.status(204).send();
        }catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao deletar usuário"});
        }
    }
}