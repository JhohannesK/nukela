import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

const BotAvatar = ({ src }: { src: string }) => {
	return (
		<Avatar className='h-8 w-8'>
			<AvatarImage src={src} />
		</Avatar>
	);
};

export default BotAvatar;
