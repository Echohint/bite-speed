import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, phoneNumber } = body;

        // 1. Validate Input
        if (!email && !phoneNumber) {
            return NextResponse.json(
                { error: "Either email or phoneNumber is required" },
                { status: 400 }
            );
        }

        // 2. Find all matching contacts
        const matchingContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phoneNumber ? [{ phoneNumber: String(phoneNumber) }] : []),
                ],
            },
        });

        // 3. Handle No Matches (Create new primary)
        if (matchingContacts.length === 0) {
            const newContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber: phoneNumber ? String(phoneNumber) : null,
                    linkPrecedence: "primary",
                },
            });

            return NextResponse.json({
                contact: {
                    primaryContatctId: newContact.id,
                    emails: newContact.email ? [newContact.email] : [],
                    phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
                    secondaryContactIds: [],
                },
            });
        }

        // 4. Trace to all related contacts
        // First, find all unique connected primary IDs
        const connectedPrimaryIds = new Set<number>();

        for (const contact of matchingContacts) {
            if (contact.linkPrecedence === "primary") {
                connectedPrimaryIds.add(contact.id);
            } else if (contact.linkedId) {
                connectedPrimaryIds.add(contact.linkedId);
            }
        }

        // Fetch the full cluster of contacts
        const allRelatedContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { id: { in: Array.from(connectedPrimaryIds) } },
                    { linkedId: { in: Array.from(connectedPrimaryIds) } }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // The oldest primary is the root primary
        const primaryContact = allRelatedContacts.find(c => c.linkPrecedence === "primary") || allRelatedContacts[0];
        const secondaryContacts = allRelatedContacts.filter(c => c.id !== primaryContact.id);

        // 5. Determine if we need to merge disjoint primaries
        const otherPrimaries = secondaryContacts.filter(c => c.linkPrecedence === "primary");

        if (otherPrimaries.length > 0) {
            await prisma.contact.updateMany({
                where: {
                    id: { in: otherPrimaries.map(c => c.id) }
                },
                data: {
                    linkedId: primaryContact.id,
                    linkPrecedence: "secondary",
                    updatedAt: new Date()
                }
            });

            // Update local state for response formulation
            for (const c of otherPrimaries) {
                c.linkPrecedence = "secondary";
                c.linkedId = primaryContact.id;
            }
        }

        // 6. Determine if we need to create a new secondary contact
        const hasNewInfo = (
            (email && !allRelatedContacts.some(c => c.email === email)) ||
            (phoneNumber && !allRelatedContacts.some(c => c.phoneNumber === String(phoneNumber)))
        );

        if (hasNewInfo) {
            const newSecondary = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber: phoneNumber ? String(phoneNumber) : null,
                    linkedId: primaryContact.id,
                    linkPrecedence: "secondary"
                }
            });
            secondaryContacts.push(newSecondary);
        }

        // 7. Formulate Response
        const emails = new Set<string>();
        const phoneNumbers = new Set<string>();

        if (primaryContact.email) emails.add(primaryContact.email);
        if (primaryContact.phoneNumber) phoneNumbers.add(primaryContact.phoneNumber);

        for (const contact of secondaryContacts) {
            if (contact.email) emails.add(contact.email);
            if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
        }

        return NextResponse.json({
            contact: {
                // Note: Typos maintained ('primaryContatctId') based on the problem statement requirements
                primaryContatctId: primaryContact.id,
                emails: Array.from(emails),
                phoneNumbers: Array.from(phoneNumbers),
                secondaryContactIds: secondaryContacts.map(c => c.id)
            }
        });

    } catch (error) {
        console.error("Identify API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
