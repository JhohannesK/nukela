import FigureForms from '@/components/figure-form';
import prismadb from '@/lib/prismadb';
import React from 'react';

const page = async ({ params }: { params: { figureId: string } }) => {
	// TODO: Allow only subscribed users to see this page in the future

	const figure = await prismadb.figure.findUnique({
		where: {
			id: params.figureId,
		},
	});
	const categories = await prismadb.category.findMany();
	return (
		<div>
			<FigureForms initialData={figure} categories={categories} />
		</div>
	);
};

export default page;
