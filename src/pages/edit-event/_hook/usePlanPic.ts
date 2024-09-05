import { useEffect, useState } from "react";
import { getAllPlans } from "../../../services/plan.service";

// Fetch plans and return the Plan_Pic for a matching Plan_Id
export const useFetchPlanPic = (planId: number) => {
  const [planPic, setPlanPic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getAllPlans(); // Fetch all plans
        if (response && Array.isArray(response.plans)) {
          const matchedPlan = response.plans.find((plan: any) => plan.Plan_Id === planId);
          if (matchedPlan && matchedPlan.Plan_Pic) {
            setPlanPic(matchedPlan.Plan_Pic); // Set the Plan_Pic if it exists
          }
        } else {
          console.error("Expected an array but got:", response);
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlans();
  }, [planId]);
  
  return { planPic, loading };
  };