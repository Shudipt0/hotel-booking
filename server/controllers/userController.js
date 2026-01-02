export const getUserData = async (req, res) => {
   try{
    const role = req.user.role;
    const recentSeachCities = req.user.recentSeachCities;
    res.json({success: true, role, recentSeachCities})
   } catch (error) {
    res.json({success: false , message: error.message})
   }
}

// store user recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
   try{
    const {recentSeachCity} = req.body;
    const user = await req.user;

    if(user.recentSeachCities.length < 3){
        user.recentSeachCities.push(recentSeachCity)
    }else{
        user.recentSeachCities.shift();
        user.recentSeachCities.push(recentSeachCity);       
    }

    await user.save();
    res.json({success: true, message: "City added"})

   } catch (error) {
    res.json({success: false , message: error.message})
   }
}