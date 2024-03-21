
import { noteIndex } from "@/lib/db/pinecone";
import { getEmbading } from "@/lib/openai";
import { createNoteValidation, deleteNoteValidation, updateNoteValidation } from "@/lib/validation/notes";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {

	try {
		const body = await req.json();
		const parseResult = createNoteValidation.safeParse(body);

		if (!parseResult.success) return Response.json({ error: parseResult.error }, { status: 400 });

		const { title, content } = parseResult.data;
		const { userId } = auth();

		if (!userId) return Response.json({ error: "Unauthorized Person Detected!. You are not allowed to create Notes." }, { status: 401 });

		const embading = await getEmbadingForNote(title, content)

		const note = await prisma?.$transaction(async (tx) => {
			const note = await tx.note.create({
				data: {
					title: title,
					content: content,
					userId: userId
				}
			})
			await noteIndex.upsert([
				{
					id: note.id,
					values: embading,
					metadata: { userId }
				}
			])
			return note;
		})

		return Response.json({ note }, { status: 201 });

	} catch (err: any) {
		console.log(err);
		return Response.json({ err: 'Internel server Error' }, { status: 500 })
	}
}
export async function PUT(req: Request) {
	try {

		const body = await req.json();
		const parseResult = updateNoteValidation.safeParse(body);

		if (!parseResult.success) return Response.json({ error: parseResult.error }, { status: 400 })

		const { title, content, id } = parseResult.data;

		const note = await prisma?.note.findUnique({ where: { id } })

		if (!note) return Response.json({ error: 'Note not found' }, { status: 404 });

		const { userId } = auth();

		if (!userId || userId !== note.userId) return Response.json({ error: "Unauthorized Person Detected!. You are not allowed to create Notes." }, { status: 401 });



		const embading = await getEmbadingForNote(title, content);

		const updateNote = await prisma?.$transaction(async (tx) => {
			const updateNote = await tx.note?.update({
				where: { id },
				data: {
					title,
					content
				}
			})

			await noteIndex.upsert([{
				id,
				values: embading,
				metadata: { userId }
			}])

			return updateNote
		})



		return Response.json({ updateNote }, { status: 200 })

	} catch (err: any) {
		console.log(err);

		return Response.json({ err: 'Internel server error' }, { status: 500 })
	}
}
export async function DELETE(req: Request) {
	try {

		const body = await req.json();
		const parseResult = deleteNoteValidation.safeParse(body);

		if (!parseResult.success) return Response.json({ error: parseResult.error }, { status: 400 })

		const { id } = parseResult.data;

		const note = await prisma?.note.findUnique({ where: { id } })

		if (!note) return Response.json({ error: 'Note not found' }, { status: 404 });

		const { userId } = auth();

		if (!userId || userId !== note.userId) return Response.json({ error: "Unauthorized Person Detected!. You are not allowed to create Notes." }, { status: 401 });

		await prisma?.$transaction(async (tx) => {

			await tx.note?.delete({ where: { id } })
			await noteIndex.deleteOne(id);

		})

		return Response.json({ message: 'Note is Deleted' }, { status: 200 })

	} catch (err: any) {
		console.log(err);

		return Response.json({ err: 'Internel server error' }, { status: 500 })
	}
}


async function getEmbadingForNote(title: string, content: string | undefined) {
	return getEmbading(title + "\n\n" + content ?? "")

}