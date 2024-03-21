import { auth } from '@clerk/nextjs'


import { Metadata } from 'next'
import React from 'react'

import prisma from "@/lib/db/prisma"
import Note from '@/components/NoteAll'
import { MotionDiv } from './components/MotionDiv'


export const metadata: Metadata = {
	title: 'Code helper - notes'
}

const page = async () => {

	const container = {
		hidden: { opacity: 1, scale: 0 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2
			}
		}
	};

	const { userId } = auth();

	if (!userId) {
		throw new Error("Invalid User!");
	}

	const allNotes = await prisma?.note.findMany({
		where: { userId }
	});

	return (
		<>

			<MotionDiv
				className="container grid  px-4 sm:grid-cols-2 lg:grid-cols-3 gap-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{allNotes?.map((ele) => (
					<Note note={ele} key={ele.id} />
				))}
			</MotionDiv>


			{allNotes?.length === 0 && (
				<div className='col-span-full text-center mt-10'>
					{"Ther's are nothing to show here! Why you waiting for? Create your own notes"}
				</div>
			)}


		</>
	)
}

export default page






// const container = {
// 	hidden: { opacity: 1, scale: 0 },
// 	visible: {
// 		opacity: 1,
// 		scale: 1,
// 		transition: {
// 			delayChildren: 0.3,
// 			staggerChildren: 0.2
// 		}
// 	}
// };

// const item = {
// 	hidden: { y: 20, opacity: 0 },
// 	visible: {
// 		y: 0,
// 		opacity: 1
// 	}
// };

// export const Example = () => (
// 	<motion.ul
// 		className="container"
// 		variants={container}
// 		initial="hidden"
// 		animate="visible"
// 	>
// 		{[0, 1, 2, 3].map((index) => (
// 			<motion.li key={index} className="item" variants={item} />
// 		))}
// 	</motion.ul>
// );
