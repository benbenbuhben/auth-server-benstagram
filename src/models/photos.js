'use strict';

const mongoose = require('mongoose');
import Users from '../auth/model.js';

const photoSchema = mongoose.Schema({
  //name: {type:String, required:true},
  photoUrl: {type:String, required:true},
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'users'},
});

photoSchema.pre('findOne', function(next) {
  console.log('pre findOne this', this);
  this.populate('user');
  next();
});

photoSchema.pre('save', function(next) {
  console.log('THIS IS', this);
  //console.log('pre findOne this', this);
  //this.populate('user');
  console.log('postPopulate', this);

  let photoId = this._id;
  let userId = this.owner;
  console.log('This is the userID', userId);

  // Is the team that we try to add the player to, valid?
  Users.findById(userId)
    .then(user => {
      if( !user ) {
        return Promise.reject('Invalid User Specified');
      }
      else {
        Users.findOneAndUpdate(
          {_id:userId},
          { $addToSet: {photos:photoId} }
        )
          .then( Promise.resolve() )
          .catch(err => Promise.reject(err) );
      }
    })
    .then(next())
    .catch(next);
  // If so, add this photo to the photos array in that team.



});

export default mongoose.model('photos', photoSchema);