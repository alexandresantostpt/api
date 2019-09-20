import { services } from '@/constants/services.const'
import Service from '@features/service/service.schema'
import ServiceFactory from '@features/service/service.factory'

const findOptions = { context: 'query', new: true }

const save = async (serviceData: any, type: services, token: String, scriptId: String) => {
    const { _id, ...data } = serviceData

    data._by = token
    data.script = scriptId
    data.deleted = false

    const model = ServiceFactory.get(type)

    if (_id) {
        await model.findOneAndUpdate(
            { _id },
            {
                $set: data
            },
            findOptions
        )
        return serviceData
    }

    return model.create(data)
}

const remove = (serviceId: String) =>
    Service.findOneAndUpdate(
        { _id: serviceId },
        {
            $set: { deleted: true }
        },
        findOptions
    )

export { save, remove }
