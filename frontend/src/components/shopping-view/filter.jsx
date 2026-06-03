import { filterOptions } from "@/config";
import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import PriceRangeSlider from "./PriceRangeSlider";
import axios from "axios";

function ProductFilter({ filters, handleFilter }) {
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 1000 });
  const [sliderValue, setSliderValue] = useState([0, 1000]);

  useEffect(() => {
    async function fetchPriceRange() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/shop/products/price-range");
        if (res.data.success) {
          const { minPrice, maxPrice } = res.data.data;
          // Ensure min is less than max for the slider to work
          const adjustedMax = maxPrice > minPrice ? maxPrice : minPrice + 100;
          setPriceBounds({ min: minPrice, max: adjustedMax });
          
          const currentMin = filters?.minPrice !== undefined ? Number(filters.minPrice) : minPrice;
          const currentMax = filters?.maxPrice !== undefined ? Number(filters.maxPrice) : adjustedMax;
          setSliderValue([currentMin, currentMax]);
        }
      } catch (err) {
        console.error("Failed to fetch price range", err);
      }
    }
    fetchPriceRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentMin = filters?.minPrice !== undefined ? Number(filters.minPrice) : priceBounds.min;
    const currentMax = filters?.maxPrice !== undefined ? Number(filters.maxPrice) : priceBounds.max;
    if (sliderValue[0] !== currentMin || sliderValue[1] !== currentMax) {
      setSliderValue([currentMin, currentMax]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, priceBounds]);

  const handleSliderChange = (newValues) => {
    setSliderValue(newValues);
    // Since there are two values, updating one after another might cause a race condition in handleFilter 
    // depending on how it's implemented. We will call it sequentially if listing.jsx supports it,
    // or just call handleFilter twice.
    handleFilter("minPrice", newValues[0]);
    handleFilter("maxPrice", newValues[1]);
  };
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-6">


        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex font-medium items-center gap-2 ">
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}

        {/* Price Range */}
        <div className="pb-4">
          <h3 className="text-base font-bold mb-3">Price Range</h3>
          <PriceRangeSlider 
            min={priceBounds.min} 
            max={priceBounds.max} 
            value={sliderValue} 
            onChange={handleSliderChange} 
          />
        </div>
        <Separator />

        {/* In-Stock Size */}
        <div>
          <h3 className="text-base font-bold mb-3">In-Stock Size</h3>
          <select 
            className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={filters?.inStockSize || ""}
            onChange={(e) => handleFilter("inStockSize", e.target.value)}
          >
            <option value="" className="bg-background text-foreground">Any Size</option>
            <option value="XS" className="bg-background text-foreground">XS</option>
            <option value="S" className="bg-background text-foreground">S</option>
            <option value="M" className="bg-background text-foreground">M</option>
            <option value="L" className="bg-background text-foreground">L</option>
            <option value="XL" className="bg-background text-foreground">XL</option>
            <option value="XXL" className="bg-background text-foreground">XXL</option>
            <option value="UK 6" className="bg-background text-foreground">UK 6</option>
            <option value="UK 7" className="bg-background text-foreground">UK 7</option>
            <option value="UK 8" className="bg-background text-foreground">UK 8</option>
            <option value="UK 9" className="bg-background text-foreground">UK 9</option>
            <option value="UK 10" className="bg-background text-foreground">UK 10</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
