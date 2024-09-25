export default function Profile() {
    const divStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '10px'
    }

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: '10px',
        padding: '10px'
    }

    return (
        <div style={divStyle}>
            <h1>Profile</h1>
            <form style={formStyle}>
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}
