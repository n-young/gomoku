import Modal from 'react-modal'
import { Header2, Text } from '../lib/Library'

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
    return (
        <Modal
            isOpen={props.isOptionsOpen}
            onRequestClose={props.closeOptions}
            style={modalStyles}
        >
            <Header2>Options</Header2>
            <Text>Under construction!</Text>
        </Modal>
    )
}