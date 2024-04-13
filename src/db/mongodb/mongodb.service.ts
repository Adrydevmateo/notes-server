import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient, MongoServerError, ObjectId, ServerApiVersion, WriteConcernError, WriteError } from 'mongodb'
import { TNote } from 'src/api/user/user.interface';

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

	CREATE(user: unknown) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			return await coll.insertOne(user)
		})
	}

	READ_USERS() {
		return this.Exec(async () => {
			const collection = this.db.collection('user')
			const users = collection.find()
			const result = []
			for await (const user of users) {
				result.push(user)
			}
			return result
		})
	}

	READ_BY_USER_ID(id: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = await coll.findOne(
				{ _id: new ObjectId(id) },
				{ projection: { notes: 0 } }
			)
			return cursor
		})
	}

	READ_BY_USER_NAME(n: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = await coll.findOne(
				{ username: n },
				{ projection: { notes: 0 } }
			)
			return cursor
		})
	}

	UPDATE(u: any) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			return await coll.updateOne(
				{ _id: { $oid: u.id } },
				{
					$set: {
						username: u.username,
						password: u.password,
					}
				}
			)
		})
	}

	// TODO: FIX
	UPDATE_USER_NOTE(id: string, n: TNote) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			// const r = await coll.updateOne()

			// console.log('[Result]: ', r)
		})
	}

	DELETE() {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			await coll.deleteOne({ _id: new ObjectId('66160564a1fda35ce414c3c5') })
		})
	}
}
