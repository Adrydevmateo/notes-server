import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, MongoServerError, ServerApiVersion } from 'mongodb'

@Injectable()
export class MongodbService {
    private client: MongoClient = undefined
    private uri: string = undefined

    constructor(private readonly configService: ConfigService) {
        this.uri = this.configService.get<string>('MONGO_CS')
        this.client = new MongoClient(this.uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        })
    }

    async Exec(fn: Function) {
        try {
            await this.client.connect()
            return await fn()
        } catch (error: unknown) {
            if (error instanceof MongoServerError) console.log('Error worth logging: ' + error)
            throw error
        } finally {
            await this.client.close()
        }
    }

    READ() {
        return this.Exec(async () => {
            const db = this.client.db('notesv1')
            const coll = db.collection('user')
            const cursor = coll.find()
            const result = []
            for await (const doc of cursor) {
                result.push(doc)
            }
            return result
        })
    }
}
