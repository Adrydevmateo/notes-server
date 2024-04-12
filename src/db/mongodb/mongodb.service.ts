import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient, MongoServerError, ObjectId, ServerApiVersion, WriteConcernError, WriteError } from 'mongodb'

@Injectable()
export class MongodbService {
	private client: MongoClient = undefined
	private uri: string = undefined
	private db: Db = undefined

	constructor(private readonly configService: ConfigService) {
		this.uri = this.configService.get<string>('MONGO_CS')
		this.client = new MongoClient(this.uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			}
		})
		this.db = this.client.db('notesv1')
	}

	private async Exec(fn: Function) {
		try {
			await this.client.connect()
			return await fn()
		} catch (error: unknown) {
			if (error) console.log('[ERROR]: ' + error)
			throw error
		} finally {
			await this.client.close()
		}
	}

	CREATE(user) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			return await coll.insertOne(user)
		})
	}

	READ() {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = coll.find()
			const result = []
			for await (const doc of cursor) {
				result.push(doc)
			}
			return result
		})
	}

	READ_BY_USER_NAME(e: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = await coll.findOne(
				{ username: e },
				{ projection: { _id: 0, notes: 0 } }
			)
			return cursor
		})
	}

	UPDATE() {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			await coll.updateOne(
				{ _id: new ObjectId('66160564a1fda35ce414c3c5') },
				{ $set: { username: "vModified@gmail.com", password: "123123123" } }
			)
		})
	}

	DELETE() {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			await coll.deleteOne({ _id: new ObjectId('66160564a1fda35ce414c3c5') })
		})
	}
}
