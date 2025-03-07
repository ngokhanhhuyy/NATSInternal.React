import React, { useState, useEffect, useTransition, createContext, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { clearAsyncModelInitializerCache } from "@/hooks/asyncModelInitializerHook";
import { UndefinedError } from "@/errors";

const simulatedLazy = <TProps extends object>(loader: () => Promise<{ default: React.ComponentType<TProps>}>) => {
    return React.lazy(async () => {
        return await Promise.all([
            loader(),
            new Promise(resolve => setTimeout(resolve))
        ]).then(([view, _]) => view);
    });
};

// Loading view and error components.
import LoadingView from "@/views/layouts/LoadingView";
import { ErrorBoundary } from "react-error-boundary";
import errorFallbackRender from "./ErrorFallbackComponent";


// View components.
const HomeView = simulatedLazy(() => import("@/views/home/HomeView"));

// User views.
const UserListView = simulatedLazy(() => import("@/views/user/userList/UserListView"));
const UserProfileView = simulatedLazy(() => import("@/views/user/userProfile/UserProfileView"));
const UserCreateView = simulatedLazy(() => import("@/views/user/userUpsert/userCreate/UserCreateView"));
const UserUpdateView = simulatedLazy(() => import("@/views/user/userUpsert/userUpdate/UserUpdateView"));
const UserPasswordChangeView = simulatedLazy(() => import("@/views/user/userPasswordChange/UserPasswordChangeView"));
const UserPasswordResetView = simulatedLazy(() => import("@/views/user/userPasswordReset/UserPasswordResetView"));

// Customer views.
const CustomerListView = simulatedLazy(() => import("@/views/customer/customerList/CustomerListView"));
const CustomerDetailView = simulatedLazy(() => import("@/views/customer/customerDetail/CustomerDetailView"));
const CustomerUpsertView = simulatedLazy(() => import("@/views/customer/customerUpsert/CustomerUpsertView"));

// Product views.
const ProductListView = simulatedLazy(() => import("@/views/product/productList/ProductListView"));
const ProductDetailView = simulatedLazy(() => import("@/views/product/productDetail/ProductDetailView"));
const ProductUpsertView = simulatedLazy(() => import("@/views/product/productUpsert/ProductUpsertView"));
const BrandUpsertView = simulatedLazy(() => import("@/views/product/brandUpsert/BrandUpsertView"));
const ProductCategoryUpsertView = simulatedLazy(() => import("@/views/product/productCategoryUpsert/ProductCategoryUpsertView"));

// Consultant views.
const ConsultantListView = simulatedLazy(() => import("@/views/consultant/consultantList/ConsultantListView"));
const ConsultantDetailView = simulatedLazy(() => import("@/views/consultant/consultantDetail/ConsultantDetailView"));
const ConsultantUpsertView = simulatedLazy(() => import("@/views/consultant/consultantUpsert/ConsultantUpsertView"));

// Supply views.
const SupplyListView = simulatedLazy(() => import("@/views/supply/supplyList/SupplyListView"));
const SupplyDetailView = simulatedLazy(() => import("@/views/supply/supplyDetail/SupplyDetailView"));
const SupplyUpsertView = simulatedLazy(() => import("@/views/supply/supplyUpsert/SupplyUpsertView"));

// Expense views.
const ExpenseListView = simulatedLazy(() => import("@/views/expense/expenseList/ExpenseListView"));
const ExpenseDetailView = simulatedLazy(() => import("@/views/expense/expenseDetail/ExpenseDetailView"));
const ExpenseUpsertView = simulatedLazy(() => import("@/views/expense/expenseUpsert/ExpenseUpsertView"));

// Order views.
const OrderListView = simulatedLazy(() => import("@/views/order/orderList/OrderListView"));
const OrderDetailView = simulatedLazy(() => import("@/views/order/orderDetail/OrderDetailView"));
const OrderUpsertView = simulatedLazy(() => import("@/views/order/orderUpsert/OrderUpsertView"));

// Treatment views.
const TreatmentListView = simulatedLazy(() => import("@/views/treatment/treatmentList/TreatmentListView"));
const TreatmentDetailView = simulatedLazy(() => import("@/views/treatment/treatmentDetail/treatmentDetailView"));
const TreatmentUpsertView = simulatedLazy(() => import("@/views/treatment/treatmentUpsert/TreatmentUpsertView"));

// Debt views.
const DebtOverviewView = simulatedLazy(() => import("@/views/debt/overview/DebtOverviewView"));
const DebtIncurrenceListView = simulatedLazy(() => import("@/views/debt/list/DebtIncurrenceListView"));
const DebtIncurrenceDetailView = simulatedLazy(() => import("@/views/debt/detail/DebtIncurrenceDetailView"));
const DebtIncurrenceUpsertView = simulatedLazy(() => import("@/views/debt/upsert/DebtIncurrenceUpsertView"));
const DebtPaymentListView = simulatedLazy(() => import("@/views/debt/list/DebtPaymentListView"));
const DebtPaymentDetailView = simulatedLazy(() => import("@/views/debt/detail/DebtPaymentDetailView"));
const DebtPaymentUpsertView = simulatedLazy(() => import("@/views/debt/upsert/DebtPaymentUpsertView"));

// Report.
const ReportView = simulatedLazy(() => import("@/views/report/monthlyReport/MonthlyReportView"));

// Services dependencies.
const routeGenerator = useRouteGenerator();

type ElementGetter = (params: Params) => React.ReactNode | null;

interface Route {
    path: RegExp;
    element: ElementGetter;
    meta: RouteMeta;
}

export interface BreadcrumbItem {
    text: string;
    to?: string;
}

export interface RouteMeta {
    pageTitle?: string;
    breadcrumbItems?: BreadcrumbItem[] | ((params: Params) => BreadcrumbItem[]);
}

interface Routes {
    [routeName: string]: Route;
}

interface Params {
    [key: string]: string;
}

const routes: Routes = {
    home: {
        path: /^\/$/,
        element: () => <HomeView />,
        meta: {
            pageTitle: "Trang chủ",
            breadcrumbItems: []
        },
    },
    userList: {
        path: /^\/users\/?$/,
        element: () => <UserListView />,
        meta: {
            pageTitle: "Danh sách nhân viên",
            breadcrumbItems: [
                { text: "Danh sách nhân viên" },
            ]
        },
    },
    userProfile: {
        path: /^\/users\/(?<id>\d+)\/?$/,
        element: (params) => <UserProfileView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Hồ sơ nhân viên",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: "/users" },
                { text: "Hồ sơ nhân viên" },
            ]
        },
    },
    userCreate: {
        path: /^\/users\/create\/?$/,
        element: () => <UserCreateView />,
        meta: {
            pageTitle: "Tạo nhân viên mới",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: routeGenerator.getUserListRoutePath() },
                { text: "Hồ sơ nhân viên" },
            ]
        },
    },
    userUpdate: {
        path: /^\/users\/(?<id>\d+)\/update\/?$/,
        element: (params) => <UserUpdateView id={parseInt(params.id as string)} />,
        meta: {
            pageTitle: "Chỉnh sửa nhân viên",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: "/users" },
                { text: "Chỉnh sửa nhân viên" },
            ]
        },
    },
    userPasswordChange: {
        path: /^\/users\/changePassword\/?$/,
        element: () => <UserPasswordChangeView />,
        meta: {
            pageTitle: "Đổi mật khẩu",
            breadcrumbItems: [
                { text: "Nhân viên", to: "/users" },
                { text: "Đổi mật khẩu" },
            ]
        }
    },
    userPasswordReset: {
        path: /^\/users\/(?<id>\d+)\/resetPassword\/?$/,
        element: (params) => <UserPasswordResetView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Đặt lại mật khẩu",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: "/users" },
                { text: "Đặt lại mật khẩu" },
            ]
        },
    },
    customerList: {
        path: /^\/customers\/?$/,
        element: () => <CustomerListView />,
        meta: {
            pageTitle: "Danh sách khách hàng",
            breadcrumbItems: [
                { text: "Khách hàng" },
            ],
        }
    },
    customerDetail: {
        path: /^\/customers\/(?<id>\d+)\/?$/,
        element: (params) => <CustomerDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Hồ sơ khách hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách khách hàng",
                    to: routeGenerator.getCustomerListRoutePath()
                },
                { text: "Hồ sơ khách hàng" }
            ]
        }
    },
    customerCreate: {
        path: /^\/customers\/create\/?$/,
        element: () => <CustomerUpsertView isForCreating={true} />,
        meta: {
            pageTitle: "Tạo khách hàng mới",
            breadcrumbItems: [
                {
                    text: "Danh sách khách hàng",
                    to: routeGenerator.getCustomerListRoutePath()
                },
                { text: "Tạo khách hàng mới" }
            ]
        }
    },
    customerUpdate: {
        path: /^\/customers\/(?<id>\d+)\/update\/?$/,
        element: (params) => (
            <CustomerUpsertView
                isForCreating={false}
                id={parseInt(params.id)}
            />
        ),
        meta: {
            pageTitle: "Chỉnh sửa khách hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách khách hàng",
                    to: routeGenerator.getCustomerListRoutePath()
                },
                { text: "Chỉnh sửa khách hàng" }
            ]
        }
    },
    productList: {
        path: /^\/products\/?$/,
        element: () => <ProductListView />,
        meta: {
            pageTitle: "Danh sách sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm" },
            ]
        }
    },
    productDetail: {
        path: /^\/products\/(?<id>\d+)\/?$/,
        element: (params) => <ProductDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chi tiết sản phẩm" }
            ]
        }
    },
    productCreate: {
        path: /^\/products\/create\/?$/,
        element: () => <ProductUpsertView />,
        meta: {
            pageTitle: "Tạo sản phẩm mới",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Tạo sản phẩm mới" }
            ]
        }
    },
    productUpdate: {
        path: /^\/products\/(?<id>\d+)\/update\/?$/,
        element: (params) => <ProductUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chỉnh sửa sản phẩm" }
            ]
        }
    },
    brandCreate: {
        path: /^\/products\/brands\/create\/?$/,
        element: () => <BrandUpsertView />,
        meta: {
            pageTitle: "Tạo thương hiệu mới",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Tạo thương hiệu mới" }
            ]
        }
    },
    brandUpdate: {
        path: /^\/products\/brands\/(?<id>\d+)\/update\/?$/,
        element: (params) => <BrandUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa thương hiệu",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chỉnh sửa thương hiệu" }
            ]
        }
    },
    productCategoryCreate: {
        path: /^\/products\/categories\/create\/?$/,
        element: () => <ProductCategoryUpsertView />,
        meta: {
            pageTitle: "Tạo phân loại sản phẩm mới",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Tạo phân loại mới" }
            ]
        }
    },
    productCategoryUpdate: {
        path: /^\/products\/categories\/(?<id>\d+)\/update\/?$/,
        element: (params) => <ProductCategoryUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa phân loại sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chỉnh sửa phân loại" }
            ]
        }
    },
    consultantList: {
        path: /^\/consultants\/?$/,
        element: () => <ConsultantListView />,
        meta: {
            pageTitle: "Danh sách tư vấn",
            breadcrumbItems: [
                { text: "Danh sách tư vấn" },
            ]
        }
    },
    consultantDetail: {
        path: /^\/consultants\/(?<id>\d+)\/?$/,
        element: (params) => <ConsultantDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết tư vấn",
            breadcrumbItems: [
                { text: "Danh sách tư vấn", to: routeGenerator.getConsultantListRoutePath() },
                { text: "Chi tiết tư vấn" },
            ]
        }
    },
    consultantCreate: {
        path: /^\/consultants\/create\/?$/,
        element: () => <ConsultantUpsertView />,
        meta: {
            pageTitle: "Tạo tư vấn mới",
            breadcrumbItems: [
                { text: "Danh sách tư vấn", to: routeGenerator.getConsultantListRoutePath() },
                { text: "Tạo tư vấn mới" },
            ]
        }
    },
    consultantUpdate: {
        path: /^\/consultants\/(?<id>\d+)\/update\/?$/,
        element: (params) => <ConsultantUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa tư vấn",
            breadcrumbItems: [
                { text: "Danh sách tư vấn", to: routeGenerator.getConsultantListRoutePath() },
                { text: "Chỉnh sửa tư vấn" },
            ]
        }
    },
    supplyList: {
        path: /^\/supplies\/?$/,
        element: () => <SupplyListView />,
        meta: {
            pageTitle: "Danh sách nhập hàng",
            breadcrumbItems: [
                { text: "Danh sách nhập hàng" },
            ]
        }
    },
    supplyDetail: {
        path: /^\/supplies\/(?<id>\d+)\/?$/,
        element: (params) => <SupplyDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết đơn nhập hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Chi tiết đơn nhập hàng" },
            ]
        }
    },
    supplyCreate: {
        path: /^\/supplies\/create\/?$/,
        element: () => <SupplyUpsertView />,
        meta: {
            pageTitle: "Tạo đơn nhập hàng mới",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Tạo đơn nhập hàng mới" },
            ]
        }
    },
    supplyUpdate: {
        path: /^\/supplies\/(?<id>\d+)\/update\/?$/,
        element: (params) => <SupplyUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa đơn nhập hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Chỉnh sửa đơn nhập hàng" },
            ]
        }
    },
    expenseList: {
        path: /^\/expenses\/?$/,
        element: () => <ExpenseListView />,
        meta: {
            pageTitle: "Danh sách chi phí",
            breadcrumbItems: [
                { text: "Danh sách chi phí" },
            ]
        }
    },
    expenseDetail: {
        path: /^\/expenses\/(?<id>\d+)\/?$/,
        element: (params) => <ExpenseDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết chi phí",
            breadcrumbItems: [
                { text: "Danh sách chi phí", to: routeGenerator.getExpenseListRoutePath()},
                { text: "Chi tiết chi phí" },
            ]
        }
    },
    expenseCreate: {
        path: /^\/expenses\/create\/?$/,
        element: () => <ExpenseUpsertView />,
        meta: {
            pageTitle: "Tạo chi phí mới",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Tạo chi phí mới" },
            ]
        }
    },
    expenseUpdate: {
        path: /^\/expenses\/(?<id>\d+)\/update\/?$/,
        element: (params) => <ExpenseUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa chi phí",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Chỉnh sửa chi phí" },
            ]
        }
    },
    orderList: {
        path: /^\/orders\/?$/,
        element: () => <OrderListView />,
        meta: {
            pageTitle: "Danh sách đơn bản lẻ",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ" },
            ]
        }
    },
    orderDetail: {
        path: /^\/orders\/(?<id>\d+)\/?$/,
        element: (params) => <OrderDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết đơn bán lẻ",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ", to: routeGenerator.getOrderListRoutePath()},
                { text: "Chi tiết đơn bán lẻ" },
            ]
        }
    },
    orderCreate: {
        path: /^\/orders\/create\/?$/,
        element: () => <OrderUpsertView />,
        meta: {
            pageTitle: "Tạo đơn bán lẻ mới",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ", to: routeGenerator.getOrderListRoutePath()},
                { text: "Tạo đơn bán lẻ mới" },
            ]
        }
    },
    orderUpdate: {
        path: /^\/orders\/(?<id>\d+)\/update\/?$/,
        element: (params) => <OrderUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa đơn bán lẻ",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ", to: routeGenerator.getOrderListRoutePath()},
                { text: "Chỉnh sửa đơn bán lẻ" },
            ]
        }
    },
    treatmentList: {
        path: /^\/treatments\/?$/,
        element: () => <TreatmentListView />,
        meta: {
            pageTitle: "Danh sách liệu trình",
            breadcrumbItems: [
                { text: "Danh sách liệu trình" },
            ]
        }
    },
    treatmentDetail: {
        path: /^\/treatments\/(?<id>\d+)\/?$/,
        element: (params) => <TreatmentDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chi tiết liệu trình",
            breadcrumbItems: [
                {
                    text: "Danh sách liệu trình",
                    to: routeGenerator.getTreatmentListRoutePath()
                },
                { text: "Chi tiết liệu trình" },
            ]
        }
    },
    treatmentCreate: {
        path: /^\/treatments\/create\/?$/,
        element: () => <TreatmentUpsertView />,
        meta: {
            pageTitle: "Tạo liệu trình mới",
            breadcrumbItems: [
                {
                    text: "Danh sách liệu trình",
                    to: routeGenerator.getTreatmentListRoutePath()
                },
                { text: "Tạo mới liệu trình" },
            ]
        }
    },
    treatmentUpdate: {
        path: /^\/treatments\/(?<id>\d+)\/update\/?$/,
        element: (params) => <TreatmentUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa liệu trình",
            breadcrumbItems: [
                {
                    text: "Liệu trình",
                    to: routeGenerator.getTreatmentListRoutePath()
                },
                { text: "Chỉnh sửa liệu trình" },
            ]
        }
    },
    debtOverviewView: {
        path: /^\/debts\/?$/,
        element: () => <DebtOverviewView />,
        meta: {
            pageTitle: "Tổng quan nợ",
            breadcrumbItems: [{ text: "Tổng quan nợ" }],
        }
    },
    debtIncurrenceListView: {
        path: /^\/debts\/incurrences\/?$/,
        element: () => <DebtIncurrenceListView />,
        meta: {
            pageTitle: "Danh sách khoản ghi nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                { text: "Danh sách khoản ghi nợ" },
            ]
        }
    },
    debtIncurrenceDetailView: {
        path: /^\/debts\/incurrences\/(?<id>\d+)\/?$/,
        element: (params) => <DebtIncurrenceDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Danh sách khoản ghi nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản ghi nợ",
                    to: routeGenerator.getDebtIncurrenceListRoutePath()
                },
                { text: "Chi tiết khoản ghi nợ" },
            ]
        }
    },
    debtIncurrenceCreateView: {
        path: /^\/debts\/incurrences\/create\/?$/,
        element: () => <DebtIncurrenceUpsertView />,
        meta: {
            pageTitle: "Tạo khoản ghi nợ mới",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản ghi nợ",
                    to: routeGenerator.getDebtIncurrenceListRoutePath()
                },
                { text: "Tạo khoản ghi nợ mới" },
            ]
        }
    },
    debtIncurrenceUpdateView: {
        path: /^\/debts\/incurrences\/(?<id>\d+)\/update\/?$/,
        element: (params) => <DebtIncurrenceUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa khoản ghi nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản ghi nợ",
                    to: routeGenerator.getDebtIncurrenceListRoutePath()
                },
                { text: "Chỉnh sửa khoản ghi nợ" },
            ]
        }
    },
    debtPaymentListView: {
        path: /^\/debts\/payments\/?$/,
        element: () => <DebtPaymentListView />,
        meta: {
            pageTitle: "Danh sách khoản trả nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                { text: "Danh sách khoản trả nợ" },
            ]
        }
    },
    debtPaymentDetailView: {
        path: /^\/debts\/payments\/(?<id>\d+)\/?$/,
        element: (params) => <DebtPaymentDetailView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Danh sách khoản trả nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản trả nợ",
                    to: routeGenerator.getDebtPaymentListRoutePath()
                },
                { text: "Chi tiết khoản trả nợ" },
            ]
        }
    },
    debtPaymentCreateView: {
        path: /^\/debts\/payments\/create\/?$/,
        element: () => <DebtPaymentUpsertView />,
        meta: {
            pageTitle: "Tạo khoản trả nợ mới",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản trả nợ",
                    to: routeGenerator.getDebtPaymentListRoutePath()
                },
                { text: "Tạo khoản trả nợ mới" },
            ]
        }
    },
    debtPaymentUpdateView: {
        path: /^\/debts\/payments\/(?<id>\d+)\/update\/?$/,
        element: (params) => <DebtPaymentUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa khoản trả nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản trả nợ",
                    to: routeGenerator.getDebtPaymentListRoutePath()
                },
                { text: "Chỉnh sửa khoản trả nợ" },
            ]
        }
    },
    reportView: {
        path: /^\/report\/?$/,
        element: () => <ReportView />,
        meta: {
            pageTitle: "Báo cáo",
            breadcrumbItems: [{ text: "Tổng quan nợ" }]
        }
    }
};

export const ClearSuspenseContext = createContext(() => { });

const HomeRoutes = () => {
    // Dependencies.
    const navigate = useNavigate();
    const location = useLocation();
    const breadcrumbStore = useBreadcrumbStore();
    const pageLoadProgressBarStore = usePageLoadProgressBarStore();

    // States.
    const [view, setView] = useState<React.ReactNode | null>(<LoadingView />);
    const [_, startTransition] = useTransition();

    useEffect(() => {
        pageLoadProgressBarStore.start();

        startTransition(async () => {
            const matchedPair = Object
                .entries(routes)
                .map(([viewName, route]) => ({ viewName, route }))
                .find(pair => pair.route.path.test(location.pathname));
    
            if (!matchedPair) {
                navigate(routeGenerator.getHomeRoutePath(), { replace: true });
                return;
            }
    
            const route = matchedPair.route;
            const match = location.pathname.match(route.path);
            const params: Params = match?.groups ?? {};
            const element = route.element(params);
            setView(element);

            if (route.meta.breadcrumbItems) {
                let breadcrumbItems: BreadcrumbItem[];
                if (typeof route.meta.breadcrumbItems === "function") {
                    breadcrumbItems = route.meta.breadcrumbItems(params);
                } else {
                    breadcrumbItems = route.meta.breadcrumbItems;
                }
                breadcrumbStore.setItems(breadcrumbItems);
                document.title = route.meta.pageTitle ?? "";
            }
        });
    }, [location.pathname]);

    useEffect(() => {
        return () => {
            clearAsyncModelInitializerCache();
        };
    }, []);

    return (
        <ErrorBoundary
            FallbackComponent={errorFallbackRender}
            onReset={(detail: { reason: "imperative-api"; args: any[]; }) => {
                setView(null);
                navigate(routeGenerator.getHomeRoutePath());
                if (detail.reason[0] === UndefinedError.constructor.name) {
                    window.location.reload();
                }
            }}>
            <Suspense>
                {view}
            </Suspense>
        </ErrorBoundary>
    );
};

export default HomeRoutes;