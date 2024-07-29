import LeftSideBarItems from "@/app/configurations/config";

function LeftSideBar({ onMenuItemClick, ActiveButtonIndex }) 
{
    return (
        <center>
            {
                LeftSideBarItems.map( (item, index) => (
                    <button onClick={() => onMenuItemClick(index)} key={index} className={`rounded-md w-11/12 h-14 mx-1 my-0.5 ${index === ActiveButtonIndex ? 'bg-slate-200 border-2 border-y-blue-800 font-semibold text-blue-800' : 'hover:bg-slate-200'}`}>
                        {item}
                    </button>
                ) )
            }
        </center>
    );
}

export default LeftSideBar;