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

    async Run() {
        try {
            await this.client.connect()
            await this.client.db('admin').command({ ping: 1 })
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } catch (error: unknown) {
            if (error instanceof MongoServerError) console.log('Error worth logging: ' + error)
            throw error
        } finally {
            await this.client.close()
        }
    }
}
