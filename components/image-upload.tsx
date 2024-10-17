'use client';
import React, { useEffect, useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';

const ImageUpload = ({
	value,
	onChange,
	disabled,
}: {
	value: string;
	onChange: (src: string) => void;
	disabled?: boolean;
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;
	return (
		<div className='space-y-4 w-full flex flex-col justify-center items-center'>
			{/* BUG: Image is not being uploaded to the browser */}
			<CldUploadButton
				options={{
					maxFiles: 1,
				}}
				uploadPreset='myuxj7bf'
			>
				<div className='p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center'>
					<div className='relative h-40 w-40'>
						<Image
							fill
							alt='upload'
							src={value || '/placeholder.svg'}
							className='rounded-lg object-cover'
						/>
					</div>
				</div>
			</CldUploadButton>
		</div>
	);
};

export default ImageUpload;
