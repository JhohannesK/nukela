import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

export type FigureKey = {
	figureName: string;
	modelName: string;
	userId: string;
};

export class MemoryManager {
	private static instance: MemoryManager;
	private history: Redis;
	private vectorDBClient: Pinecone;

	public constructor() {
		this.history = Redis.fromEnv();
		this.vectorDBClient = new Pinecone();
	}

	public async init() {
		if (this.vectorDBClient instanceof Pinecone) {
			// Initialize a client
			const pc = new Pinecone({
				apiKey: process.env.PINECONE_API_KEY!,
			});
		}
	}

	public async vectorSearch(
		recentChatHistory: string,
		figureFileName: string
	) {
		const pineconeClient = <Pinecone>this.vectorDBClient;

		const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX!);

		const vectorStore = await PineconeStore.fromExistingIndex(
			new OpenAIEmbeddings({
				openAIApiKey: process.env.OPENAI_API_KEY,
			}),
			{ pineconeIndex: pineconeIndex as any }
		);

		const similarDocs = await vectorStore
			.similaritySearch(recentChatHistory, 3, { figureFileName })
			.catch((err) => {
				console.log(
					'🚀 ~ MemoryManager ~ similarDocs ~ err: Failed to get vector search results: ',
					err
				);
			});

		return similarDocs;
	}

	public static async getInstance(): Promise<MemoryManager> {
		if (!MemoryManager.instance) {
			MemoryManager.instance = new MemoryManager();
			await MemoryManager.instance.init();
		}

		return MemoryManager.instance;
	}

	private generateRedisFigureKey(figureKey: FigureKey): string {
		return `${figureKey.figureName}-${figureKey.modelName}-${figureKey.userId}`;
	}

	public async writeToHistory(text: string, figureKey: FigureKey) {
		if (!figureKey || typeof figureKey.userId === 'undefined') {
			console.log('Figure key set incorreclty');
			return '';
		}

		const key = this.generateRedisFigureKey(figureKey);
		const result = await this.history.zadd(key, {
			score: Date.now(),
			member: text,
		});
		return result;
	}

	public async readLatestHistory(figureKey: FigureKey): Promise<string> {
		if (!figureKey || typeof figureKey.userId === 'undefined') {
			console.log('Figure key set incorreclty');
			return '';
		}
		const key = this.generateRedisFigureKey(figureKey);
		let result = await this.history.zrange(key, 0, Date.now(), {
			byScore: true,
		});

		result = result.slice(-30).reverse();
		const recentChats = result.reverse().join('\n');
		return recentChats;
	}

	public async seedChatHistory(
		seedContent: string,
		delimiter: string = '\n',
		figureKey: FigureKey
	) {
		const key = this.generateRedisFigureKey(figureKey);

		if (await this.history.exists(key)) {
			console.log('User already has chat history');
			return;
		}

		const content = seedContent.split(delimiter);
		let counter = 0;

		for (const line of content) {
			await this.history.zadd(key, { score: counter, member: line });
			counter += 1;
		}
	}
}
