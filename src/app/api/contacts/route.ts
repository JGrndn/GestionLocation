import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    orderBy: { nom: "asc" },
    include: { locations: { orderBy: { dateArrivee: "desc" } } },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const contact = await prisma.contact.create({
    data: {
      prenom: body.prenom,
      nom: body.nom,
      email: body.email || null,
      telephone: body.telephone || null,
      adresse: body.adresse || null,
    },
  });
  return NextResponse.json(contact, { status: 201 });
}
