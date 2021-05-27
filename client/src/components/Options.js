import Modal from 'react-modal'
import { Header2, HContainer, Input, Text } from '../lib/Library'
import { useUsername } from "../contexts/UsernameProvider"

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        textAlign: "center"
    }
};

export default function Options(props) {
    const { username, setUsername } = useUsername()

    return (
        <Modal
            isOpen={props.isOptionsOpen}
            onRequestClose={props.closeOptions}
            style={modalStyles}
        >
            <Header2>Options</Header2>
            <HContainer>
                <Text>Username:</Text>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </HContainer>
        </Modal>
    )
}