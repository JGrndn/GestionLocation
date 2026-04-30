import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { LocationDocument } from "@/components/pdf/LocationDocument";
import React from "react";

type Params = { params: Promise<{ id: string; locId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, locId } = await params;

  const contact = await prisma.contact.findUnique({ where: { id } });
  const location = await prisma.location.findUnique({ where: { id: locId } });

  if (!contact || !location) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const element = React.createElement(LocationDocument, {
    contact,
    location: {
      ...location,
      dateArrivee: location.dateArrivee.toISOString(),
      depart: location.depart.toISOString(),
      prixBase: Number(location.prixBase),
      taxeParNuit: Number(location.taxeParNuit),
      frais: Number(location.frais),
      acompte: Number(location.acompte),
      caution: Number(location.caution),
    },
  }) as React.ReactElement<import("@react-pdf/renderer").DocumentProps>;

  const buffer = await renderToBuffer(element);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="location_${contact.nom}_${location.dateArrivee.toISOString().slice(0, 10)}.pdf"`,
    },
  });
}