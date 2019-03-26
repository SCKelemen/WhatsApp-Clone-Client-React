import { DataProxy } from 'apollo-cache'
import { defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import * as fragments from '../graphql/fragments'
import * as queries from '../graphql/queries'
import { Message, useMessageAddedSubscription } from '../graphql/types'

type Client = ApolloClient<any> | DataProxy

export const useCacheService = () => {
  useMessageAddedSubscription({
    onSubscriptionData: ({ client, subscriptionData: { data: { messageAdded } } }) => {
      writeMessage(client, messageAdded)
    }
  })
}

export const writeMessage = (client: Client, message: Message) => {
  let fullChat
  try {
    fullChat = client.readFragment({
      id: defaultDataIdFromObject(message.chat),
      fragment: fragments.fullChat,
      fragmentName: 'FullChat',
    })
  } catch (e) {
    return
  }

  if (!fullChat) return
  if (fullChat.messages.some(m => m.id === message.id)) return

  fullChat.messages.push(message)
  fullChat.lastMessage = message

  client.writeFragment({
    id: defaultDataIdFromObject(message.chat),
    fragment: fragments.fullChat,
    fragmentName: 'FullChat',
    data: fullChat,
  })
}
