import React from "react"
import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...")
    let result = [];

    try {
        // console.log("reached function catalogPageData");
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId, })

        // console.log("response is........",response)
        if(!response?.data?.success)
            throw new Error("Could not fetch category page data")
        result = response?.data
        // console.log("resulttt is........",result)

    } catch (error) {
        console.log("CATALOG PAGE DATA API ERROR.............", error)
        // toast.error(error.message)
        result = error.response?.data
    }
    toast.dismiss(toastId)

    return result
}