import FigureForms from '@/components/figure-form';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';

const page = async ({ params }: { params: { figureId: string } }) => {
	// TODO: Allow only subscribed users to see this page in the future

	const { userId, redirectToSignIn } = auth();

	if (!userId) return redirectToSignIn();

	const figure = await prismadb.figure.findUnique({
		where: {
			id: params.figureId,
			userId,
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
