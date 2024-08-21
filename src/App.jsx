import React, { useState } from "react"

const App = () => {
  const [searchError, setSearchError] = useState(false)
  const [emptyFieldError, setEmptyFieldError] = useState(false)
  const [user, setUser] = useState(null)

  const submitForm = async (e) => {
    e.preventDefault()
    setSearchError(false)
    setEmptyFieldError(false)

    const githubUsernameEl = e.target.elements["github-username"]
    githubUsernameEl.value = githubUsernameEl.value.trim()
    const githubUsername = githubUsernameEl.value

    if (!githubUsername.length) {
      setEmptyFieldError(true)
      alert("Field is empty") // Alert for empty field
      return
    }

    const githubUsernameJoined = githubUsername.split(" ").join("")
    await fetchUser(githubUsernameJoined)
  }

  const fetchUser = async (username) => {
    setSearchError(false)

    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      const userData = await response.json()

      if (!response.ok) {
        setSearchError(true)
        alert("User not found") // Alert for user not found
        return
      }

      setUser(userData)
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = date.toLocaleString("en", { month: "short" })
    return `${date.getDate()} ${month} ${date.getFullYear()}`
  }

  return (
    <div className={`container mx-auto p-4`}>
      <main className='mx-auto md:w-1/2'>
        <SearchForm
          submitForm={submitForm}
          searchError={searchError}
          emptyFieldError={emptyFieldError}
        />
        {user && <UserSection user={user} formatDate={formatDate} />}
      </main>
    </div>
  )
}

const SearchForm = ({ submitForm, searchError, emptyFieldError }) => (
  <form
    className='flex justify-center items-center bg-secondary my-9 mx-0 shadow-lg rounded-lg p-2.5 w-full'
    onSubmit={submitForm}
  >
    <input
      type='text'
      className='text-[1.125rem] leading-[25px] py-1.5 mr-5 flex-grow min-w-0'
      placeholder='Search GitHub username...'
      name='GitHub Username'
      id='github-username'
    />
    <button className='btn btn-primary ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg'>
      Search
    </button>
  </form>
)

const UserSection = ({ user, formatDate }) => (
  <section className='flex justify-center items-start shadow-lg rounded-[15px] p-12'>
    <div className='grow'>
      <div className='flex items-center mb-3'>
        <img
          src={user.avatar_url}
          alt={user.name}
          className='mr-9 rounded-full h-[117px] w-[117px]'
        />
        <div>
          <h2 className='text-2xl font-bold'>{user.name}</h2>
          <p className='text-base md:text-lg lg:text-xl'>@{user.login}</p>
          <p className='text-base md:text-lg lg:text-xl'>
            Joined {formatDate(user.created_at)}
          </p>
        </div>
      </div>
      <p className='my-8 text-base md:text-lg lg:text-xl'>
        {user.bio || "This profile has no bio"}
      </p>
      <ul className='flex text-center justify-between items-start bg-gray-300 p-4 rounded-[10px] mb-9'>
        <li>
          <h4 className='text-base md:text-lg lg:text-xl'>Repos</h4>
          <h2 className='text-base md:text-lg lg:text-xl'>
            {user.public_repos}
          </h2>
        </li>
        <li>
          <h4 className='text-base md:text-lg lg:text-xl'>Followers</h4>
          <h2 className='text-base md:text-lg lg:text-xl'>{user.followers}</h2>
        </li>
        <li>
          <h4 className='text-base md:text-lg lg:text-xl'>Following</h4>
          <h2 className='text-base md:text-lg lg:text-xl'>{user.following}</h2>
        </li>
      </ul>
    </div>
  </section>
)

export default App
