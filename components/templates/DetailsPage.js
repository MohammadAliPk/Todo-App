
function DetailsPage({ todo }) {

    return (
        <div className="details-container">
            <h4>Title: {todo.title}</h4>
            <span className={todo.status}>{todo.status}</span>
            <p>{todo.description}</p>
            <button>Edit</button>
        </div>
    )
}

export default DetailsPage;