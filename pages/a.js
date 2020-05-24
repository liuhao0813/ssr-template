import Comp from '../components/comp'
import styled from 'styled-components'



const Title = styled.h1`
    color: red;
    font-size: 40px;
`
const a = () => <Comp><Title>this is a title</Title></Comp>


export default a