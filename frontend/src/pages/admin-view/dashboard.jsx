import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { fetchLowStockProducts } from "@/store/admin/products-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AlertTriangle, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { lowStockProducts } = useSelector((state) => state.adminProducts);

  function handleUploadFeatureImage() {
    const url = uploadedImageUrls[0];
    if (!url) return;
    dispatch(addFeatureImage(url)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFiles([]);
        setUploadedImageUrls([]);
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchLowStockProducts());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-foreground">Dashboard Analytics</h1>
        <p className="text-muted-foreground text-lg">Manage your dynamic homepage content and view store insights.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Revenue", value: "₹34,52,231.89", desc: "+20.1% from last month" },
          { title: "Subscriptions", value: "+2350", desc: "+180.1% from last month" },
          { title: "Sales", value: "+12,234", desc: "+19% from last month" },
          { title: "Active Now", value: "+573", desc: "+201 since last hour" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Low-Stock Alert Card */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5" />
                Low Stock Alert — {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {lowStockProducts.map((p) => {
                  const criticalVariants = (p.sizeVariants || []).filter((v) => v.stock <= 5 && v.stock > 0);
                  return (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-none" />
                        <span className="font-semibold text-amber-800 dark:text-amber-300 truncate max-w-[180px]">{p.title}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {criticalVariants.map((v) => (
                          <span
                            key={v.size}
                            className="text-xs bg-amber-200 dark:bg-amber-800/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium"
                          >
                            {v.size}: {v.stock}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-400 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-600 dark:hover:bg-amber-900/30"
                onClick={() => navigate("/admin/products")}
              >
                Manage Stock →
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="bg-card border border-border shadow-sm mt-8">
        <CardHeader>
          <CardTitle>Homepage Slideshow Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
            Upload Image
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {featureImageList && featureImageList.length > 0
              ? featureImageList.map((featureImgItem, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative overflow-hidden rounded-xl shadow-sm group"
                    key={idx}
                  >
                    <img
                      src={featureImgItem.image}
                      className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">Active</span>
                    </div>
                  </motion.div>
                ))
              : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
