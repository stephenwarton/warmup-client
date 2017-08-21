import React, { Component } from 'react';
import axios from 'axios';

const $ = window.$;

class Reviews extends Component{
  constructor(props) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onAddReview = this.onAddReview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onOpenNewModal = this.onOpenNewModal.bind(this);
    this.onEditReview = this.onEditReview.bind(this);

    this.state = {
      reviews: [],
      title: "",
      description: "",
      edit: false,
      id: ""
    };
  }

  onEditReview(e){
    e.preventDefault();
    const id = this.state.id;
    axios.put(`https://g-warmup.herokuapp.com/api/v1/reviews/${id}`, {
      title: this.state.title,
      description: this.state.description,
      users_id: 1
    })
    .then((response) => {
      let newReviewArray = this.state.reviews.map(review => {
        if(review.id === parseInt(id,10)){
          review.title = this.state.title;
          review.description = this.state.description
        }
        return review;
      })
      this.setState({
        reviews: newReviewArray,
        title: "",
        description: ""
      });
      $('#exampleModal').modal('hide')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onOpenNewModal(e){
    e.preventDefault();
    this.setState({
      title: "",
      description: "",
      edit: false
    })
  }

  handleChange(e){
    const target = e.target;
    this.setState((prevState,props) => {
      prevState[target.id] = target.value
    });
  }

  onAddReview(e){
    e.preventDefault();

    axios.post('https://g-warmup.herokuapp.com/api/v1/reviews', {
      title: this.state.title,
      description: this.state.description,
      users_id: 1
      })
      .then((response) => {
        const newReview = {
          id: response.data[0].id,
          title: response.data[0].title,
          description: response.data[0].description
        }
        this.setState({
          reviews: this.state.reviews.concat([newReview]),
          title: "",
          description: ""
        });
        $('#exampleModal').modal('hide')
      })
      .catch(function (error) {
        console.log(error);
      });
    }

  handleEdit(e){
    e.preventDefault();
    this.setState({ edit: true });
    const id = e.target.id;
    let index = this.state.reviews.map(review => review.id).indexOf(parseInt(id,10));
    this.setState({
      title: this.state.reviews[index].title,
      description: this.state.reviews[index].description,
      id: id
    });
  }

  handleDelete(e){
    e.preventDefault();
    //console.log(e.target.id);
    axios.delete(`https://g-warmup.herokuapp.com/api/v1/reviews/${e.target.id}`)
      .then(res => {
        axios.get(`https://g-warmup.herokuapp.com/api/v1/reviews`)
          .then(res => {
            //console.log(res)
          const reviews = res.data;
          this.setState({ reviews });
        });
    });
  }

  componentDidMount() {
    axios.get(`https://g-warmup.herokuapp.com/api/v1/reviews`)
      .then(res => {
        //console.log(res)
      const reviews = res.data;
      this.setState({ reviews });
    });
}

  render(){
    const title = this.state.title;
    const description = this.state.description;
    return(
      <div className='container'>
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={this.onOpenNewModal}>
          Add New Review
        </button>
          {this.state.reviews.map(review =>
            <div className="card w-75" key={review.id}>
              <div className="card-body">
                <h4 className="card-title">{review.title}</h4>
                <p className="card-text">{review.description}</p>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={this.handleEdit} id={review.id}>
                  Edit
                </button>
                <a href="" className="btn btn-danger" id={review.id} onClick={this.handleDelete}>Delete</a>
                {
                  this.state.edit
                  ? <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Review</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={this.onEditReview}>
                              <label htmlFor="title">Title</label>
                              <input className="form-control" type="text" placeholder="Title" id="title" value={title} onChange={this.handleChange} />
                              <label htmlFor="description">Description</label>
                              <textarea className="form-control" type="text" placeholder="Description" id="description" value={description} onChange={this.handleChange} />
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  : <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">New Review</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={this.onAddReview}>
                              <label htmlFor="title">Title</label>
                              <input className="form-control" type="text" placeholder="Title" id="title" value={title} onChange={this.handleChange} />
                              <label htmlFor="description">Description</label>
                              <textarea className="form-control" type="text" placeholder="Description" id="description" value={description} onChange={this.handleChange} />
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="submit" className="btn btn-primary">Add Review</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            )}
          </div>
        )
      }
    }

export default Reviews;
