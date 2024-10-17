import ChatComp from '@/components/chat-component';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }: { params: { chatId: string } }) => {
	const { userId, redirectToSignIn } = auth();

	if (!userId) return redirectToSignIn();

	const figure = await prismadb.figure.findUnique({
		where: {
			id: params.chatId,
		},
		include: {
			Message: {
				orderBy: {
					createdAt: 'asc',
				},
				where: {
					figureId: userId,
				},
			},
			_count: {
				select: {
					Message: true,
				},
			},
		},
	});

	if (!figure) redirect('/');

	return (
		<div className='h-full'>
			<ChatComp figure={figure} />
		</div>
	);
};

export default page;
