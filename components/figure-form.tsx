'use client';
import { Category, Figure } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Separator } from './ui/separator';
import ImageUpload from './image-upload';
import { Input } from './ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Name is required',
	}),
	description: z.string().min(1, {
		message: 'Description is required',
	}),
	instructions: z.string().min(200, {
		message: 'Instructions require at least 200 characters',
	}),
	seed: z.string().min(200, {
		message: 'Seed require at least 200 characters',
	}),
	categoryId: z.string().min(1, {
		message: 'Category is required',
	}),
	src: z.string().optional().nullable(),
});

const FigureForms = ({
	initialData,
	categories,
}: {
	initialData: Figure | null;
	categories: Category[];
}) => {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			description: '',
			categoryId: '',
			instructions: '',
			seed: '',
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (initialData) {
				await axios.patch(`/api/figure/${initialData.id}`, values);
			} else {
				await axios.post(`/api/figure`, values);
			}
			toast({
				description: 'successful 💯',
			});
			router.refresh();
			router.push('/');
		} catch (error) {
			toast({
				variant: 'destructive',
				description: 'Oops, something went wrong',
			});
		}
	};
	return (
		<div className='h-full p-4 space-y-2 max-w-3xl mx-auto'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 pb-8'
				>
					<div className='space-y-2 w-full'>
						<div>
							<h3 className='text-lg font-medium'>
								General Information
							</h3>
							<p className='text-sm text-muted-foreground'>
								Information about your figure
							</p>
						</div>
						<Separator className='bg-primary/10' />
						<FormField
							name='src'
							render={({ field }) => (
								<FormItem className='flex flex-col items-center justify-center space-y-4 '>
									<FormControl>
										<ImageUpload
											disabled={isLoading}
											onChange={field.onChange}
											value={field.value}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormField
								name='name'
								control={form.control}
								render={({ field }) => (
									<FormItem className='col-span-2 md:col-span-1'>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder={'Mark Zuckerburg'}
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is what is going to be displayed
										</FormDescription>
									</FormItem>
								)}
							/>
							<FormField
								name='description'
								control={form.control}
								render={({ field }) => (
									<FormItem className='col-span-2 md:col-span-1'>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder={''}
												{...field}
											/>
										</FormControl>

										<FormDescription>
											Short description about the figure you want to
											create
										</FormDescription>
									</FormItem>
								)}
							/>
							<FormField
								name='categoryId'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='bg-background'>
													<SelectValue
														defaultValue={field.value}
														placeholder='Select a category'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((category) => {
													return (
														<SelectItem
															value={category.id}
															key={category.id}
														>
															{category.name}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='space-y-2 pt-6 w-full'>
							<div>
								<h3 className='text-lg font-medium'>Configuration</h3>
								<p className='text-sm text-muted-foreground'>
									Detailed instructions for AI behaviour
								</p>
							</div>
							<Separator className='bg-primary/10' />
						</div>
						<FormField
							name='instructions'
							control={form.control}
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Instructions</FormLabel>
									<FormControl>
										<Textarea
											rows={6}
											className='resize-none'
											disabled={isLoading}
											placeholder={' '}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Detailed behaviour of your figure.
									</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							name='seed'
							control={form.control}
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Example of conversation</FormLabel>
									<FormControl>
										<Textarea
											rows={6}
											className='resize-none'
											disabled={isLoading}
											placeholder={' '}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Example of how conversation looks like
									</FormDescription>
								</FormItem>
							)}
						/>
					</div>
					<div className='w-full flex items-center justify-center'>
						<Button disabled={isLoading} size={'lg'}>
							{initialData ? 'Edit Character' : 'Create Character'}
							<Wand2 className='w-4 h-4 ml-2' />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default FigureForms;
