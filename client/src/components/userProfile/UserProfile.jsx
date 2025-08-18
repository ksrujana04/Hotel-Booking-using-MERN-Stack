import useFetch from "../../hooks/useFetch";

const UserProfile = (userId) => {
    const {data,loading,error} = useFetch(`users/${userId.userId}`)
    return <>
    <h1>Hello User</h1>
    <p>{data.email}</p>
    <p>{data.phone}</p>
    <p>{data.country}</p>
    <p>{data.city}</p>
    </>

}
export default UserProfile;