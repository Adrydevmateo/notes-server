import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { TNoteDTO, TNoteUpsertDTO, TUserDTO } from 'src/api/user/user.interface';

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

	READ_USER_BY_ID(id: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = await coll.findOne({ _id: new ObjectId(id) })
			return cursor
		})
	}

	READ_USER_BY_NAME(username: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const cursor = await coll.findOne({ username: username })
			return cursor
		})
	}

	UPDATE_USER(user: TUserDTO) {
		return this.Exec(async () => {
			const coll = this.db.collection('user')
			const updated = await coll.updateOne(
				{ _id: new ObjectId(user.id) },
				{
					$set: {
						username: user.username,
						password: user.password,
					}
				}
			)
			return updated
		})
	}

	DELETE_USER(id: string) {
		return this.Exec(async () => {
			const userCollection = this.db.collection('user')
			const noteCollection = this.db.collection('note')
			const deletedUser = await userCollection.deleteOne({ _id: new ObjectId(id) })
			const deletedNote = await noteCollection.deleteMany({ ownerId: id });
			return { deletedUser, deletedNote }
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

	UPDATE_NOTE(updateData: TNoteUpsertDTO) {
		return this.Exec(async () => {
			const coll = this.db.collection('note')
			const updated = await coll.updateOne(
				{ _id: { $eq: new ObjectId(updateData.id) } },
				{
					$set: updateData.set
				},
				{ upsert: true }
			)
			return updated
		})
	}

	DELETE_NOTE(ownerId: string) {
		return this.Exec(async () => {
			const coll = this.db.collection('note')
			const deleted = await coll.deleteOne({ ownerId: ownerId })
			return deleted
		})
	}
	//#endregion Note
}
