/**
* - CommentBox
* - CommentList
*  - Comment
* - CommentForm
**/

// {} - react reads anything between single curly braces as JAVASCRIPT

// ------------------- RENDERING ------------------
var comments = [
  { id: 1, author: "Tony", text: "React is cool."},
  { id: 2, author: "Jesse", text: "Redux is **super** _duper_ cool!"}
];

var CommentBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },

  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      method: 'GET',
      datatype: 'json',
      success: function (data) {
        this.setState({data: data});
      }.bind(this)
    });
  },

  handleCommentSubmit: function (comment) {
    $.ajax({
      url: this.props.url,
      method: 'POST',
      datatype: 'json',
      data: comment,
      success: function (data) {
        console.log(data);
        this.setState({data: this.state.data.concat(data)});
      }.bind(this)
    });
  },

  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, 5000);
  },

  render: function () {
    return (
      <div className="commentBox">
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <CommentList data={this.state.data} /> 
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        <Comment
          key={index}
          author={comment.author}
        >
          {comment.text}
        </Comment>
      );
    });

    // [
    //   <Comment author="Tony">React is cool.</Comment>,
    //   <Comment author="Jesse">Redux is **super** _duper_ cool!</Comment>
    // ];

    return (
      <div className="commentList">
        {commentNodes.reverse()}
      </div>
    );
  }
});

// ------------------- PROPERTIES ------------------
var Comment = React.createClass({
  rawMarkup: function () {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function () {
    // this.props.author = this.props.author.toUpperCase(); // DONT DO THIS!!!

    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});
// ------------------- PROPERTIES ------------------

var CommentForm = React.createClass({
  getInitialState: function () {
    return { author: '', text: '' };
  },

  handleAuthorChange: function (e) {
    this.setState({ author: e.target.value })
  },

  handleTextChange: function (e) {
    this.setState({ text: e.target.value })
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var author = this.state.author;
    var text = this.state.text;
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({ author: '', text: '' });
  },

  render: function () {
    return (
      <form
        className="commentForm"
        onSubmit={this.handleSubmit}
      >
        <input
          type="text"
          placeholder="Your Name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say Something"
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <button type="submit">Post</button>
      </form>
    );
  }
});

ReactDOM.render(
  <CommentBox url="http://localhost:3000/comments" />, // what you're rendering
  document.getElementById('content') // where you're rendering it to
);
// code flow
// renders CommentBox
// calls render method on CommentBox
// returns/renders everything passed through i.e. CommentList and CommentForm
// *** ReactDOM.render MAKE SURE THIS COMES AFTER EVERYTHING - this way everything is defined before hand and can render correctly***
// ------------------- RENDERING ------------------