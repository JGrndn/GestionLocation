import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; locId: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { locId } = await params;
  const body = await req.json();

  const location = await prisma.location.update({
    where: { id: locId },
    data: {
      dateArrivee: new Date(body.dateArrivee),
      depart: new Date(body.depart),
      adultes: parseInt(body.adultes) || 1,
      enfants: parseInt(body.enfants) || 0,
      animaux: parseInt(body.animaux) || 0,
      prixBase: parseFloat(body.prixBase) || 0,
      taxeParNuit: parseFloat(body.taxeParNuit) || 0,
      frais: parseFloat(body.frais) || 0,
      acompte: parseFloat(body.acompte) || 0,
      caution: parseFloat(body.caution) || 0,
    },
  });
  return NextResponse.json(location);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { locId } = await params;
  await prisma.location.delete({ where: { id: locId } });
  return NextResponse.json({ ok: true });
}
