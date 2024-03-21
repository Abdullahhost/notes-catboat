"use client"

import { Note as NoteModel } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { timeCalculating } from "@/lib/createdHistory"
import AddEditNoteDialog from "./AddEditNoteDialog"
import { useState } from "react"
import { MotionDiv } from "@/app/notes/components/MotionDiv"


type NoteProps = {
	note: NoteModel
}

const Note = ({ note }: NoteProps) => {

	const item = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1
		}
	};

	const [showEditDialog, setShowEditDialog] = useState(false)

	const wasUpdated = note.updatedAt > note.createdAt

	const updatedDateOrCreatedAt = (
		wasUpdated ? note.updatedAt : note.createdAt
	).toDateString();

	return (
		<div className="relative ">
			<MotionDiv
				className="item"
				variants={item}
			>
				<Card className="cursor-pointer  hover:shadow-lg transition-shadow  hover:bg-lime-100 hover:dark:bg-neutral-800" onClick={() => setShowEditDialog(true)}>
					<CardHeader>
						<CardTitle className="z-30">{note.title}</CardTitle>
						<div className="grid grid-cols-2 place-items-stretch">
							<CardDescription>
								<span className="flex flex-col">
									<span>
										{updatedDateOrCreatedAt}
									</span>
									<span>
										{wasUpdated && " (updated)"}
									</span>
								</span>

							</CardDescription>
							<CardDescription>
								{/* {wasUpdated ? timeCalculating(note.updatedAt) : timeCalculating(note.createdAt)} */}
								{wasUpdated ? (
									<span className="flex flex-col transition-all h-[25px] delay-150 overflow-hidden hover:h-[50px]">
										<span>
											{"update " + timeCalculating(note.updatedAt)}
										</span>
										<span>
											{"Created " + timeCalculating(note.createdAt)}
										</span>
									</span>
								)
									: timeCalculating(note.createdAt)}
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<p className="whitespace-pre-line">
							{note.content}
						</p>
					</CardContent>
				</Card>
				<AddEditNoteDialog open={showEditDialog} setOpen={setShowEditDialog} editDialog={note} />
			</MotionDiv>
		</div>
	)
}

export default Note
