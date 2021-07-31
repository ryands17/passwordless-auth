import { Code, CodeConfig } from '@aws-cdk/aws-lambda'

let fromAssetMock: jest.SpyInstance

beforeAll(() => {
  fromAssetMock = jest.spyOn(Code, 'fromAsset').mockReturnValue({
    isInline: false,
    bind: (): CodeConfig => {
      return {
        s3Location: {
          bucketName: 'my-bucket',
          objectKey: 'my-key',
        },
      }
    },
    bindToResource: () => {
      return
    },
  } as any)
})

afterAll(() => {
  fromAssetMock?.mockRestore()
})
