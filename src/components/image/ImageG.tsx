import React from 'react'

export default function ImageG({imageResponse}) {
    
  return (
    <img src={imageResponse.image_base64}></img>
  )
}
