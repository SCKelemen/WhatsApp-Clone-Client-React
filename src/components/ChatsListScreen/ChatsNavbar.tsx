import { Toolbar } from '@material-ui/core'
import * as React from 'react'
import styled from 'styled-components'

const Container = styled(Toolbar) `
  background-color: var(--primary-bg);
  color: var(--primary-text);
  font-size: 20px;
  line-height: 40px;
`

const ChatsNavbar = () => (
  <Container>
    Whatsapp Clone
  </Container>
)

export default ChatsNavbar
