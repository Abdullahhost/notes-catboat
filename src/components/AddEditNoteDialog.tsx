
"use client"

import { CreateNoteValidation, createNoteValidation } from "@/lib/validation/notes";
import { useForm } from "react-hook-form";

import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingBUtton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";


type AddEditNoteDialogProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	editDialog?: Note
}



const AddEditNoteDialog = ({ open, setOpen, editDialog }: AddEditNoteDialogProps) => {


	const router = useRouter();
	const [deleteInProgress, setDeleteInProgress] = useState(false);

	const form = useForm<CreateNoteValidation>({
		resolver: zodResolver(createNoteValidation),
		defaultValues: {
			title: editDialog?.title || '',
			content: editDialog?.content || ''
		}

	})

	const onSubmit = async (input: CreateNoteValidation) => {
		try {

			if (editDialog) {
				const response = await fetch('https://notes-catboat.vercel.app/api/notes', {
					method: 'PUT',
					body: JSON.stringify({
						id: editDialog.id,
						...input
					}),
				})
				if (!response.ok) throw new Error("Status :" + response.status);

			} else {
				const response = await fetch('https://notes-catboat.vercel.app/api/notes', {
					method: 'POST',
					body: JSON.stringify(input),
				})
				if (!response.ok) throw new Error("Status :" + response.status);
				form.reset();
			}

			router.refresh();
			setOpen(false);

		} catch (err: any) {
			console.log(err);
			// throw new Error("SomeThing is wrong!");
		}
	}


	const onDeleteNote = async () => {

		if (!editDialog) return;
		setDeleteInProgress(true)
		try {

			const response = await fetch('/api/notes', {
				method: 'DELETE',
				body: JSON.stringify({
					id: editDialog.id
				}),
			})
			if (!response.ok) throw new Error("Status :" + response.status);

			router.refresh();
		} catch (err: any) {
			alert("This operation not execute this time. Try again")
			throw new Error("SomeThing is wrong!");
		} finally {
			setDeleteInProgress(false);
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen} >
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-center">{editDialog ? "Update Note" : "Add Note"}</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Note Title</FormLabel>

										<FormControl>
											<Input placeholder="Title is required" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Note Content</FormLabel>
										<FormControl>
											<Textarea placeholder="Content is optional " {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter >
								<LoadingBUtton className="xl:mb-3" onClick={onDeleteNote} variant={"destructive"} type="button" loading={deleteInProgress} disabled={form.formState.isSubmitting}>
									Delete
								</LoadingBUtton>
								<LoadingBUtton type="submit" loading={form.formState.isSubmitting}>
									Submit
								</LoadingBUtton>

							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

		</>
	)
}

export default AddEditNoteDialog
