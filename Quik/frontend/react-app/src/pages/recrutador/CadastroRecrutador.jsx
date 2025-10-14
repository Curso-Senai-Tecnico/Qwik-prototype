import React from 'react'
import Input from '../../Input.jsx'

export default function Cadastro() {
  return (
    <div className='bg-red-400'>
      <form>
      <Input
      type='text'
      id='nome'
      name='nome'
      placeholder='Nome'
      />
      </form>
    </div>
  )
}
