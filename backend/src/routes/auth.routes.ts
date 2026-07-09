import { Router } from "express";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const users = [
  {
    id: "user-001",
    name: "Recrutadora App BiT",
    email: "recrutador@appbit.local",
    password: "appbit123",
    role: "recruiter",
  },
];

export const authRoutes = Router();

authRoutes.post("/login", (req, res) => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Dados de login invalidos",
      issues: parsedBody.error.issues,
    });
  }

  const { email, password } = parsedBody.data;
  const user = users.find(
    (candidate) => candidate.email === email && candidate.password === password,
  );

  if (!user) {
    return res.status(401).json({
      message: "Email ou senha invalidos",
    });
  }

  const { password: _password, ...safeUser } = user;

  return res.json({
    message: "Login realizado com sucesso",
    user: safeUser,
  });
});
