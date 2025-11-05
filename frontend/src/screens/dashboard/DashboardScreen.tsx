import { useSelector } from "react-redux";

const DashboardScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);

  return (
    <div className="bg-black min-h-screen flex items-center justify-center gap-10 flex-col">
      <div>
        <p className="text-6xl text-white/80">Dashboard Screen In Construction, {userInfo.name}</p>
      </div>
    </div>
  )
}
export default DashboardScreen