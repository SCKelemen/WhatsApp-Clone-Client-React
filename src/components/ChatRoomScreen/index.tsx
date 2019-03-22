import gql from 'graphql-tag'
import * as React from 'react'
import { useCallback } from 'react'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import ChatNavbar from './ChatNavbar'
import MessageInput from './MessageInput'
import MessagesList from './MessagesList'

const Container = styled.div `
  background: url(/assets/chat-background.jpg);
  display: flex;
  flex-flow: column;
  height: 100vh;
`

const getChatQuery = gql `
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
`

const ChatRoomScreen = ({ history, match }) => {
  const { params: { chatId } } = match
  const client = useApolloClient()
  const { data: { chat } } = useQuery(getChatQuery, {
    variables: { chatId }
  })

  const onSendMessage = useCallback((content) => {
    const message = {
      id: chat.messages.length + 1,
      createdAt: Date.now(),
      content,
    }

    client.writeQuery({
      query: getChatQuery,
      variables: { chatId },
      data: {
        chat: {
          ...chat,
          messages: chat.messages.concat(message),
        },
      },
    })
  }, [chat])

  if (!chat) return null

  return (
    <Container>
      <ChatNavbar chat={chat} history={history} />
      <MessagesList messages={chat.messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </Container>
  )
}

export default ChatRoomScreen
