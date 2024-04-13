import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient, MongoServerError, ObjectId, ServerApiVersion, WriteConcernError, WriteError } from 'mongodb'
import { TNote, TNoteDTO, TUserDTO } from 'src/api/user/user.interface';

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

	CREATE_USER(user: TUserDTO) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const created = await coll.insertOne(user)
			return created
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

	READ_USER_BY_NAME(username: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = await coll.findOne({ username: username })
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

	DELETE() {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			await coll.deleteOne({ _id: new ObjectId('66160564a1fda35ce414c3c5') })
		})
	}

	//#region Note
	CREATE_NOTE(note: TNoteDTO) {
		return this.Exec(async () => {
			const coll = this.db.collection('note')
			const created = await coll.insertOne(note)
			return created
		})
	}

	READ_NOTES() {
		return this.Exec(async () => {
			const collection = this.db.collection('note')
			const notes = collection.find()
			const result = []
			for await (const note of notes) {
				result.push(note)
			}
			return result
		})
	}

	READ_NOTE_BY_ID(id: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('note')
			const cursor = await coll.findOne({ _id: new ObjectId(id) })
			return cursor
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
	//#endregion Note
}
